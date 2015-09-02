# BS-Card-Web-Game

(According to Wikipedia, the card game "BS" is also known as "Cheat",
"Bull****", and "I Doubt It.")

About
-----

This is an application that I programmed during the summer before my
freshman year in college (that is, during the summer of 2015). In
programming this application, to challenge myself,
I wanted to avoid using any frameworks
given to me by books, and I successfully did that. (Usually, I have
some framework to start with that may be from, for example, a book's
supplied source code, but I didn't use any such framework this time.)

Regarding languages, I used HTML5, CSS, JavaScript,
and a little bit of PHP.

Regarding other people's software, I used jQuery and QUnit. Also,
for the project glossary, I used AngularJS. I downloaded the QUnit
(JavaScript and CSS) files, but I included both jQuery and AngularJS
with the Google CDN (Content Delivery Network).

Features
--------

The user interacts with the game through clicking. He/she can choose
which of three styles (i.e. stylesheets) that he/she wants the game to
use, and he/she can choose which of three background tracks that he/she
wants the game to use.

The application allows much of what is expected in a typical
game of BS. Each player has to claim to play cards of a certain rank.
Another player can call "BS" in response, risking that he/she will take
the center pile of cards, but also potentially forcing a lying player
to take his/her cards back along with the center pile. Each player is
shown a list of his/her cards as he/she does his turn and as
he/she decides whether or not to call "BS". Victory is achieved by the
player who successfully empties his/her hand without anyone's being
correct in calling "BS".

Yet, as of the latest release, the game only works if everyone plays
on the same computer. Thus, most of the time, the players cannot all
look at the screen at the same time, otherwise they would see each
other's cards. However, the game does warn the players about who
should look at the screen next. Admittedly, this does make the game
significantly less playable, but I wasn't trying to program an
application that wasn't trivial; I was programming for practice.
However, if I get to implement multiplayer
through a server with Node.js, then these problems will be resolved.

With each defined function is a contract explaining things such as
the function's preconditions, its postconditions, whether or not it
has a unit test, its parameters (if any), what it returns (if anything),
and what it throws (e.g. exceptions) (if anything).

With the unit tests,
I mainly tested postconditions and return values. I also tested that
the functions that I coded to throw exceptions threw those exceptions.

I used exceptions to verify that some crucial requirements were met
regarding preconditions and parameters.

I used alerts to inform the user of when he/she is trying to do
something illegal, such as submitting zero cards on his/her turn.

The todo list is in todo-list.txt.

Releases
--------

The latest release is: v1.0

Please see the releases section under this repository on GitHub
to download the latest release.

How to Run the Game
-------------------

Download the source code (preferably from the releases section of
this repository on GitHub) and run index.php.

Because the application
uses PHP, you'll need to use something that supports PHP. For example,
I used Microsoft WebMatrix to run the project.

The application works on any major browser (e.g. Chrome, Internet
Explorer, Opera, Firefox, Safari). However, users of older versions
of those browsers may not be able to see the gradients, a CSS3 feature,
that appear on picked cards. Thus, those users must be able to
identify which cards they've picked
based on the transparency of the cards; users of browsers that do
support gradients will notice the tint of picked cards.

The background music doesn't work on older versions of Safari. Although
W3Schools states that Safari 4.0 supports the audio element, my Safari
browser, 5.1.7 for Windows, doesn't. Because my version seems to be
the last available version of Safari for Windows, I can't determine
the earliest version of Safari needed for the user to hear the
background music.

How to Run the Unit Tests
-------------------------

Run unit-tests.html. The tests use QUnit. They don't use PHP, so you
don't need any PHP-supporting software to run the tests. (The tests
use artificial "form data" where form data read with PHP would
normally be needed.)

How to Use the Included Batch and Shell Scripts
-----------------------------------------------

The batch and shell scripts can be run from a console window (e.g. I
used Git Bash). I used these scripts to perform certain tasks more
quickly.

My only batch file, open-my-files.bat, opens with Notepad++ each of
the files that I tended to edit. (As I programmed this application,
I would edit in Notepad++, refresh the project in WebMatrix, and run
the project from WebMatrix.)

Each of the shell scripts comes from another one of my
repositories: Useful-Shell-Scripts. Each shell script contains comments
regarding what each does and what arguments each needs. Some of them
create a Git commit.

How to Use the Application Dictionary
-------------------------------------

Run dictionary.html. It doesn't use PHP, so you don't need any
PHP-supporting software to run it.

Use of Git Hooks
----------------

The only Git hook I used was the pre-commit one that is supplied to
every Git repository. The only reason I used this hook was to prevent
myself from committing files that contained trailing whitespace. To
enable this hook, after downloading the source code, from the top of
the directory, go into the .git folder. After, go into the hooks
folder. In there, rename "pre-commit.sample" to "pre-commit".

Author
------

That is me, Aaron Kaloti.

Contact Information
-------------------

My email address: aarons.7007@gmail.com

My YouTube channel (in which I demonstrate my finished applications):
https://www.youtube.com/channel/UCHhcIcXErjijtAI9TWy7wNw/videos

Acknowledgements
----------------

The following books helped teach me skills that helped me program this
application:
"HTML5 Games Development by Example" by Makzan and
"The Pragmatic Programmer" by Andy Hunt and Dave Thomas.

The spritesheet of the cards and the background image of the third
selectable style came from the source code of the book "HTML5 Games
Development by Example" by Makzan.

All background audio tracks come from the soundtrack of the
video game "Pac-Man World".

W3Schools and the jQuery API also helped. I used W3Schools.com
to determine which browsers supported which features (e.g. gradients).