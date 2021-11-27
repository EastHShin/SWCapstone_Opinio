#!/bin/bash

CURRENT_PORT=$(cat /home/ec2-user/service.inc | grep -Po '[0-9]+' | tail -1)
TARGET_PORT=0
REPOSITORY=/home/ec2-user/plantrowth
JAR_NAME=$(ls $REPOSITORY/build/libs/ | grep '.jar' | tail -n 1)
JAR_PATH=$REPOSITORY/build/libs/$JAR_NAME

echo "> Current port of running WAS is ${CURRENT_PORT}."

if [ ${CURRENT_PORT} -eq 8081 ]; then
  TARGET_PORT=8082
elif [ ${CURRENT_PORT} -eq 8082 ]; then
  TARGET_PORT=8081
else
  echo "> No WAS is connected to nginx"
fi

TARGET_PID=$(lsof -Fp -i TCP:${TARGET_PORT} | grep -Po 'p[0-9]+' | grep -Po '[0-9]+')

if [ ! -z ${TARGET_PID} ]; then
  echo "> Kill WAS running at ${TARGET_PORT}."
  sudo kill ${TARGET_PID}
fi

nohup java -jar \
    -Dserver.port=${TARGET_PORT} \
    -Dspring.config.location=classpath:/application.properties,classpath:/application-real.properties,/home/ec2-user/application-real-db.properties,/home/ec2-user/application-aws.properties,/home/ec2-user/application-credentials.properties,/home/ec2-user/application-kakao.properties \
    -Dspring.profiles.active=real \
    $JAR_PATH > $REPOSITORY/nohup.out 2>&1 &
echo "> Now new WAS runs at ${TARGET_PORT}."
exit 0