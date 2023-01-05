#########################################################################################
# Version: 1.0
# Created: 05.01.2023
# Last Update: 05.01.2023 by Patrick Rüede
# Description: This script will install all the necessary software for the Raspberry Pi 4
# To run this script, type the following command in the terminal:
# sudo chmod +x setup.sh
# sudo ./setup.sh
#########################################################################################

#!/bin/bash

# Install the necessary software
sudo apt-get install -y unclutter
sudo apt-get install -y git
sudo apt-get install -y nodejs
npm install -g npm@latest

# Update the system
sudo apt-get update
sudo apt-get upgrade -y

# Clone the project from GitHub
$github="https://github.com/sa-fruh"
$repo="Raspberry-Pi4-Startup"

$username="sa-fruh"
$pak="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"

sudo git clone "https://$username:$pak@github.com/$username/$repo.git" /etc/startup

# Give the sa-raspberrypi user all permissions for the directory
sudo chown -R sa-raspberrypi:sa-raspberrypi /etc/startup
sudo chmod -x /etc/startup/startup.sh
cd /etc/startup
npm install

# Edit the autostart file
$file="/etc/xdg/lxsession/LXDE-pi/autostart"
$text="\n\n####################################\n@xset s off\n@xset -dpms@xset s noblank\n@unclutter -idle 100\n@/etc/startup/startup.sh\n####################################\n"

sudo echo $text >> $file

# Reboot the system
sudo reboot now