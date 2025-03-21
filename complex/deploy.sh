docker build -t dmitriiziidik/multi-client:latest -t dmitriiziidik/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t dmitriiziidik/multi-server:latest -t dmitriiziidik/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t dmitriiziidik/multi-worker:latest -t dmitriiziidik/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push dmitriiziidik/multi-client:latest
docker push dmitriiziidik/multi-server:latest
docker push dmitriiziidik/multi-worker:latest

docker push dmitriiziidik/multi-client:$SHA
docker push dmitriiziidik/multi-server:$SHA
docker push dmitriiziidik/multi-worker:$SHA

kubectl apply -f k8s
kubectl set image deployments/server-deployment server=dmitriiziidik/multi-server:$SHA
kubectl set image deployments/client-deployment client=dmitriiziidik/multi-client:$SHA
kubectl set image deployments/worker-deployment worker=dmitriiziidik/multi-worker:$SHA