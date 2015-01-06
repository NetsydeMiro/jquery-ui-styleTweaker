#/bin/bash

#TODO: add screen command so that each of these is running
# in a split terminal, and get rid of detach option
jekyll serve --watch --detach --host 0.0.0.0 --baseurl ''
livereloadx -s _site
