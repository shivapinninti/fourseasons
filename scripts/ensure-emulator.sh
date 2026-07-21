#!/usr/bin/env bash
set -euo pipefail

export ANDROID_HOME="${ANDROID_HOME:-/opt/homebrew/share/android-commandlinetools}"
export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-$ANDROID_HOME}"
export JAVA_HOME="${JAVA_HOME:-$HOME/.jdks/amazon-corretto-17.jdk/Contents/Home}"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"

if adb devices | grep -q 'emulator-.*device'; then
  echo "Emulator already running"
  adb devices
  exit 0
fi

echo "Starting Android emulator (Demo_API31)..."
nohup emulator -avd Demo_API31 -no-snapshot -no-audio -gpu swiftshader_indirect -no-boot-anim \
  > /tmp/emulator-appium.log 2>&1 &

adb wait-for-device
for i in $(seq 1 90); do
  if [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ]; then
    echo "Emulator booted"
    adb devices
    exit 0
  fi
  sleep 2
done

echo "Emulator failed to boot in time" >&2
tail -30 /tmp/emulator-appium.log >&2
exit 1
