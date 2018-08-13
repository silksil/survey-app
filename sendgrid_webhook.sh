function localtunnel {
  lt -s oaiejfnvoiasdfjjkls123123dfasasdfaaflkjoiwecj --port 5000
}
until localtunnel; do
echo "localtunnel server crashed"
sleep 2
done
