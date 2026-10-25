# APPSCON 2026 – Buzzer Round (4 teams, phones)

Same setup as the e-Souvenir unveil: GitHub Pages + the HiveMQ relay. Its own private topic, so it cannot clash with the unveil.

## Put it online
1. In the existing GitHub repository, choose **Add file → Upload files** and drag in all the files (index.html, host.html, buzzer.html, config.js, relay.js, buzzer.wav, README.md). Commit.
2. After about a minute open `https://robinhood2318-prog.github.io/<repository>/quiz/`.

## On the day
- **Auditorium laptop:** open `quiz/host.html` in Chrome or Edge. Press **P** for the control panel, type the four team names, then click anywhere: the screen goes full screen (no tabs, no taskbar). If someone presses Esc, the next click or key puts it back. Open it on this one laptop only.
- **Phones (one per team, a second phone per team is fine as a spare):** press **J** on the laptop to show four QR codes. Each team scans its own code. The tile on the screen turns to “Phone ready” with the delay in ms.
- Phones can be on the institute Wi-Fi or on mobile data; they do not need to share the laptop’s network. Click once anywhere on the laptop page before the round so the browser allows sound.

## Running a question
| Key | What it does |
|---|---|
| Space | Open buzzers for the next question (press again to lock) |
| C | Correct: adds points, locks buzzers |
| W | Wrong: deducts points, passes to the next team in line |
| N | Pass to the next team in line, no points |
| 1–4 | Buzz for a team from the laptop keyboard (backup if a phone fails) |
| U | Undo last score |
| T / Y | Start or pause the round clock / reset it (only if a round clock is set in the panel; buzzers lock at zero) |
| J / P / F | Join codes / control panel / full screen |

All teams use the same buzzer sound, `buzzer.wav`. It plays on the team’s phone the moment they tap, and on the laptop when that team is called. To change the sound, replace `buzzer.wav` with another file of the same name. Phones have a **Test sound** button; turn the phone volume up.

Defaults (change in the panel): +10 correct, −5 wrong, 5 s to answer after a buzz, no round clock, 400 ms tie window. Scores and names survive a page refresh.

## How it stays fair
Every phone keeps measuring its delay to the laptop and works out the laptop’s clock. When a team taps, the phone stamps the press in the laptop’s time, so a team on a slower connection is not penalised. The laptop waits 400 ms after the first buzz to collect near-simultaneous taps, then ranks them by press time and shows the gaps (e.g. “+0.04 s”).

## Rehearse
Do one run on the institute Wi-Fi with four phones before the quiz. If the laptop loses internet, the bottom-left of the screen says so; it reconnects by itself, and keys 1–4 still let you run the round by ear.

---

# Scoreboard for the whole quiz (`scoreboard.html`)

Open `scoreboard.html` on the auditorium laptop and click once to go full screen. It runs entirely on the laptop: no phones and no relay are needed, and everything is saved on the laptop, so it survives a refresh.

- **P** opens the quizmaster panel on the left: screen title, rounds (name, marks for Correct / Wrong / Pass / Bonus, order, add, delete), teams (2 to 6) and the scores of the round on screen, which can be typed directly.
- **Marking:** press the team number (1–6) or click its tile, then **C** correct, **W** wrong, **S** pass (a passed question answered correctly), **B** bonus. **U** undoes the last mark.
- **← / →** (or PageUp / PageDown on a clicker) change the round on screen.
- **O**, or the OVERVIEW tab on the right edge, opens the score overview: every team’s marks in every round, with totals and ranks.
- **Download scores (CSV)** in the panel saves a record that opens in Excel.
