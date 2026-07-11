# public/

Static assets served at the site root.

## Background music

Place your soundtrack here as **`music.mp3`** (served at `/music.mp3`). It loops
after the visitor taps the "enter" overlay, and can be toggled from the navbar.

To use a different file name or a remote URL, set the `NEXT_PUBLIC_MUSIC_URL`
environment variable instead (e.g. `NEXT_PUBLIC_MUSIC_URL=/audio/theme.mp3`).

If no audio file is present the site still works — the toggle simply has nothing
to play.
