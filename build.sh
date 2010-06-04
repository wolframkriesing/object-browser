#
#	Tt copies the files needed for making the
#	W3C widget build in the right location.
#

rm -Rf tmp

# Create the directory structure we will need within the wgt file.
mkdir -p tmp/js
mkdir -p tmp/css
mkdir -p tmp/img

cd tmp

# All JavaScript files, that need to be included in the widget.
cp ../src/js/*.js ./js
cp ../src/css/*.css ./css
cp ../src/img/*.png ./img

# All other files.
cp ../src/index.html .
cp ../src/config.xml .




# Create the wgt file, which is the final opera widget!
rm ../dist/object-browser.wgt
zip -r ../dist/object-browser.wgt config.xml index.html js/ css/ img/


# Clean up.
cd ..
rm -Rf tmp

