# The given parameter should be the name of the file to create.
# Note that any already staged files will be included in the generated commit.
# Sample usage: add-file.sh hello-world.txt

# Create the file
echo > $1

# Edit the batch file that opens files
sed -i "s~exit~start Notepad++ $1\nexit~" open-my-files.bat

# Commit the additions
git add $1
git add open-my-files.bat
git commit -m "Added new file: $1"