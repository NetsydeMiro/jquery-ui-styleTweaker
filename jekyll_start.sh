#/bin/bash

#TODO: add screen command so that each of these is running
# in a split terminal
jekyll serve --watch --detach --host 0.0.0.0
livereloadx -s _site
