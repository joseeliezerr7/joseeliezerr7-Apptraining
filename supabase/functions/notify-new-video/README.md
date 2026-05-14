# notify-new-video

Sends an Expo push to every user that has a `push_token` saved on their profile, whenever a row is inserted into `public.videos`.

## Setup

```bash
# from /mobile
supabase functions deploy notify-new-video

# Optional (raises Expo's rate limit):
supabase functions secrets set EXPO_ACCESS_TOKEN=<token-from-expo.dev>
```

## Connect the trigger

Supabase Dashboard → Database → Webhooks → "Create new hook":

- Name: `notify-new-video`
- Table: `public.videos`
- Events: **Insert**
- Type: **HTTP Request**
- URL: `https://<project>.supabase.co/functions/v1/notify-new-video`
- HTTP Headers: `Authorization: Bearer <service_role key>`

Each insert in `videos` will POST the row to the function, which fans out a push to every device.

## Test

Insert a row in `videos` from the SQL editor. Check function logs:

```bash
supabase functions logs notify-new-video --follow
```
