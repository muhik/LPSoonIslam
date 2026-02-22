npx -y create-next-app@latest app_temp --typescript --tailwind --eslint --app --src-dir --import-alias '@/*' --use-npm
Move-Item -Path 'app_temp\*' -Destination '.' -Force
Move-Item -Path 'app_temp\.*' -Destination '.' -Force
Remove-Item -Path 'app_temp' -Recurse -Force
