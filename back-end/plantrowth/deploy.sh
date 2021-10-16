#!/bin/bash

REPOSITORY=/home/ec2-user/plantrowth
cd $REPOSITORY

APP_NAME=plantrowth
JAR_NAME=$(ls $REPOSITORY/build/libs/ | grep '.jar' | tail -n 1)
JAR_PATH=$REPOSITORY/build/libs/$JAR_NAME

CURRENT_PID=$(pgrep -f $APP_NAME)

if [ -z $CURRENT_PID]
then
        echo "> no stop."
else
        echo "> kill -9 $CURRENT_PID"
        sudo kill -9 $CURRENT_PID
        sleep 5
fi

echo "> $JAR_PATH deploy"
nohup java -jar -Dspring.profiles.active=prod $JAR_PATH > /dev/null 2> /dev/null &
