FROM python:3.8

WORKDIR /app
COPY . .
ADD app.py /
RUN pip install --no-cache -r requirements.txt

EXPOSE 5000

CMD ["flask", "run", "--host", "0.0.0.0", "--without-threads"]
