#
#	Tt copies the files needed for making the
#	W3C widget build in the right location.
#

rm -Rf tmp

# Create the directory structure we will need within the wgt file.
mkdir -p tmp/src/js
mkdir -p tmp/src/css
mkdir -p tmp/src/img

cd tmp/src

# All JavaScript files, that need to be included in the widget.
cp ../../src/js/*.js ./js
cp ../../src/css/*.css ./css
cp ../../src/img/*.png ./img

# All other files.
cp ../../src/index.html .
cp ../../src/config.xml .




# Create the wgt file, which is the final opera widget!
rm ../../dist/object-browser.wgt
zip -r ../../dist/object-browser.wgt config.xml index.html js/ css/ img/


#
# Create the Nokia WRT widget.
#
rm config.xml
cp ../../src/Info.plist .
cd .. # Move to /tmp/ so we have a "src" directory which we can zip then
# A nokia WRT widget has to be in the directory "src" for packaging it ... for whatever reason, but it wont install otherwise ... grrrr
zip -r ../dist/object-browser.wgz src/*


# Clean up.
cd ..
rm -Rf tmp

