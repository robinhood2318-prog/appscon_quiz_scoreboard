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

**Quiz plan built in (organisers’ guidelines):** Round 1 – Part 1 to Round 4 – Part 2, then Round 5 – Buzzer round. Two-part questions (Round 1 – Part 1, Round 3 – Part 2): 10 points per sub-question, 5 per sub-question on a pass. Round 2 – Part 2: four sub-questions, 5 each (20 a question), 2.5 each on a pass. All other parts: 10 direct, 5 on a pass. No negative marking in Rounds 1–4. Buzzer round: +10 correct, −5 wrong, no pass (a wrong answer ends the question; tick “pass to the next team” on the buzzer screen’s panel to change this). 30 s for a direct question, 5 s for a pass. Everything is editable in the panel; “Restore the quiz plan” puts it back.

**Rounds (defaults, all editable in the panel):** Round 1 Timeline (Part 1 Days, Part 2 Regulatory Affairs) · Round 2 Rules and Algorithms (Part 1 Rules, Part 2 Therapeutic Algorithms) · Round 3 Visual (Part 1 Trial Designs, Part 2 Plots: 5 a question, 2.5 on a pass) · Round 4 Brevia and Trivia (Part 1 Brevia, Part 2 Trivia) · Round 5 Rapid Fire (the buzzer screen’s title page).

**Running order with title pages:** each round opens with a title page (“Round 1” and the round’s name), then its parts (“Part 1”, “Part 2”), each with its own name. Press **→** to step through: Round 1 → Part 1 → Part 2 → Round 2 → … The buzzer round has no title page on the scoreboard; the buzzer screen opens on its own title page (Round 5 and its name), and → or Space goes to the buzzers. Names are typed in the panel (P): title-page cards for round names, part cards for part names; the buzzer round’s card sets the buzzer screen’s title page.

**Teams A–D and the answering order (per part, in the panel):** teams are Team A, B, C, D (keys 1–4). Each part has its own order, which decides who starts, who gets the next direct question (**N**) and where a pass goes (**W**): R1 P1 A B C D · R1 P2 D C B A · R2 P1 B C D A · R2 P2 A D C B · R3 P1 C D A B · R3 P2 B A D C · R4 P1 D A B C · R4 P2 C B A D. A part opens with its first team selected. Type a different order in the part’s *Order* box (e.g. D C B A). **Pass on** is ticked for every part except Round 2 – Part 2; when a pass comes back round to the team that was asked first, the question ends.

**Running a question:** select the team (1–4), press **T** to start the 30 s timer. Correct: **C** (once per sub-question). Wrong or unanswered: **W** passes it to the next team and starts the 5 s timer; if they get it, **S**. Space pauses the timer, X hides it.

Open `scoreboard.html` on the auditorium laptop and click once to go full screen. It runs entirely on the laptop: no phones and no relay are needed, and everything is saved on the laptop, so it survives a refresh.

- **P** opens the quizmaster panel on the left: screen title, rounds (name, marks for Correct / Wrong / Pass / Bonus, order, add, delete), teams (2 to 6) and the scores of the round on screen, which can be typed directly.
- **Marking:** press the team number (1–6) or click its tile, then **C** correct, **W** wrong, **S** pass (a passed question answered correctly), **B** bonus. **U** undoes the last mark.
- **← / →** (or PageUp / PageDown on a clicker) change the round on screen.
- **O**, or the OVERVIEW tab on the right edge, opens the score overview: every team’s marks in every round, with totals and ranks.
- **Download scores (CSV)** in the panel saves a record that opens in Excel.

## Buzzer round inside the scoreboard
The scoreboard and the buzzer screen share the laptop’s browser storage. The round ticked **“Scores come from the buzzer screen”** (the Buzzer round, by default) takes its scores from `host.html`: play the buzzer round there, come back to `scoreboard.html`, and the scores are already in. Team names typed on the scoreboard are copied to the buzzer screen (first 4 teams). Use the same laptop and the same browser for both, and press **Reset scores** on the buzzer screen (P panel) after any rehearsal.

## Live screen: display system and MC (`scores.html`)
`scores.html` mirrors the quiz laptop exactly: the scoreboard, the overview when it is open, the buzzer screen during the buzzer round (including the join codes and who buzzed), switching automatically as the laptop moves between pages. Open it on the computer connected to the projector, click once for full screen and sound; the hall hears the buzzer and marking sounds from that computer. The MC can open the same link on a laptop or tablet. It is view only and needs internet on both ends.

**Part marks:** select the team and press **M** (or *Custom mark* in the panel) for ¼, ½ or ¾ of the correct mark, ½ of the pass mark, or any number you type (7.5, 2.5, −2 …).

## If the internet fails
- **Already open pages keep working.** The scoreboard runs on the laptop; don’t refresh it. Only the display mirror, the MC’s screen and the phone buzzers need internet.
- **Display:** connect the quiz laptop to the projector with an HDMI cable; the laptop screen is the scoreboard (the P panel stays hidden unless opened).
- **Offline copy:** unzip these files into a folder on the laptop before the event and double-click `scoreboard.html`. Unlock it once with the code, then **Load backup** (panel → Backup). The buzzer screen also opens offline; phones can’t connect, so press 1–4 for the team that buzzed first.
- **Backups:** panel → **Download backup** after each round. It holds every round, mark, team and score, including the buzzer round, and loads into the online page or the offline copy.
- **Mobile hotspot:** if only the venue Wi-Fi fails, a phone hotspot for the laptop and the display system keeps everything online.
