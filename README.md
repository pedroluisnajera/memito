# Memito — phase 1

Your personal "remember everything" app: quick capture, tasks, reminders, links, notes, and where you parked.

## First-time setup (once, about 10 minutes)

1. **Install Node.js** on your PC: go to https://nodejs.org, download the **LTS** version, install it with default options.
2. **Install Expo Go** on your Xiaomi from the Google Play Store.
3. In this folder, **double-click `setup.bat`**. Wait until it says *Done!*
   - If Windows shows "Windows protected your PC", click *More info → Run anyway* (it's your own script).

## Run the app (every time)

1. Double-click **`start.bat`**. A QR code appears in the black window.
2. Open **Expo Go** on your phone → **Scan QR code** → point at the screen.
3. Memito opens on your phone. Keep the black window open while testing.
4. When you change code, the app on the phone refreshes by itself.

**QR code doesn't connect?** Phone and PC must be on the same Wi-Fi. If they are and it still fails, stop with `Ctrl+C` and run `npx expo start --tunnel` in this folder instead.

## Install Memito as a real app (APK, no PC needed after)

1. Create a free account at https://expo.dev/signup
2. Make sure `setup.bat` has been run once.
3. Double-click **`build-apk.bat`**, log in, and answer **Y** to the questions.
4. Expo builds the app in the cloud (~10–20 min). At the end you get a **link + QR code**.
5. Open the link on your Xiaomi → download **Memito.apk** → tap it → allow "Install unknown apps" for your browser when Android asks → Install.
6. Send the same link to your girlfriend for her S22.

Each time we change the app, run `build-apk.bat` again and install the new APK over the old one (your data is kept).

## Test checklist (phase 1 acceptance)

- [ ] Save a note, a task and a link from Home (paste a YouTube link: it should auto-tag as *Videos*)
- [ ] Set a reminder 2 minutes ahead, close Expo Go → notification arrives
- [ ] "I parked" → save spot with a photo → "Walk me to my car" opens Google Maps
- [ ] Close and reopen the app → everything is still there

## What's where (for the curious)

| Folder / file | What it is (UiPath analogy) |
|---|---|
| `app/(tabs)/index.js` | Home screen |
| `app/(tabs)/tasks.js`, `reminders.js`, `links.js`, `notes.js` | One file per tab |
| `app/parking.js` | Parking screen |
| `src/store.js` | Where data is saved on the phone (like a local data table) |
| `src/notifications.js` | Schedules reminder notifications |
| `src/links.js` | Link categories + auto-categorize rules (add your own sites here) |
| `src/ui.js` | Reusable buttons, cards, inputs (like reusable workflows/components) |
| `src/theme.js` | Colors — change `accent` to restyle the whole app |

## Known limits in phase 1

- Data lives only on this phone (no backup/sync yet — that's phase 2).
- Runs inside Expo Go; a real installable "Memito" app (APK) comes once we're happy with it.
- Parking photos are kept in the phone's temporary storage and may be cleared by Android after a while.
