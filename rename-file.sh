# The first parameter should be the old name of the file.
# The second parameter should be the new name of the file.
# Sample usage: rename-file.sh play.html play.php

# Rename the file
git mv $1 $2

# Edit the batch file that opens files (if applicable)
sed -i "s~$1~$2~" open-my-files.bat

# Commit the change (The renamed file was added by "git mv")
git add open-my-files.bat
git commit -m "Renamed file: $1 -> $2"