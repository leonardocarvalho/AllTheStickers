set -e

root=$(git rev-parse --show-toplevel)
pushd $root

sed -i '' -e 's/applicationId "com.allthestickers"/applicationId "com.allthestickers.prod"/g' android/app/build.gradle
sed -i '' -e 's/<string name="app_name">682<\/string>/<string name="app_name">682-prod<\/string>/g' android/app/src/main/res/values/strings.xml
sed -i '' -e 's/"package_name": "com.allthestickers"/"package_name": "com.allthestickers.prod"/g' android/app/google-services.json

react-native run-android --variant release

sed -i '' -e 's/applicationId "com.allthestickers.prod"/applicationId "com.allthestickers"/g' android/app/build.gradle
sed -i '' -e 's/<string name="app_name">682-prod<\/string>/<string name="app_name">682<\/string>/g' android/app/src/main/res/values/strings.xml
sed -i '' -e 's/"package_name": "com.allthestickers.prod"/"package_name": "com.allthestickers"/g' android/app/google-services.json

popd
