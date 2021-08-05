# Prerequisites (REQUIRED)

See the main README and complete the pre-reqs before starting this guide

# 📖 Resources

-   How to make subgraph queries - https://thegraph.com/docs/graphql-api#queries​
-   Deploy your own subgraph - https://thegraph.com/docs/deploy-a-subgraph#create-a-graph-explorer-account​

# 🤓 Local development

Here we will cover the following:

1. Deploy the subgraph to a `docker container`.
2. Deploy the ERC20 contract to `Ganache`.
3. Check that your setup is correct by running some `tests`.

If you get stuck, see The Graph [docs](https://thegraph.com/docs/quick-start#local-development).

## Initial setup

First install these dependencies:

-   [docker](https://docs.docker.com/install/)
-   [docker-compose](https://docs.docker.com/compose/install/)
-   [yarn](https://yarnpkg.com/getting-started/install/)

Now install Ganache CLI:

```bash
npm i -g ganache-cli
```

Also in a separate terminal clone the repo and install the node packages:

````bash
git clone https://github.com/pi0neerpat/thegraph-hacker-kit/
cd thegraph-hacker-kit/examples/erc20
yarn

### Ganache

Start ganache. It's helpful to specify a mnemonic, so you can hard-code the address in `subgraph.yaml` and the test files.

```bash
ganache-cli -h 0.0.0.0 -m 'deputy taste judge cave mosquito supply hospital clarify argue aware abuse glory'
````

### Graph-node

Download the `graph-node` Docker instance.

```bash
git clone https://github.com/graphprotocol/graph-node/
cd graph-node/docker
```

If on Linux, run the following script. You should be already logged into docker

```bash
# For Linux machines
sudo apt install jq
./setup.sh # writes the host IP to the docker-compose file
```

> Note: If you get a "version" error, update your docker-compose with [these instructions](https://docs.docker.com/compose/install/). If you get an error like `ERROR: could not find an available, non-overlapping IPv4 address...` then try turning off OpenVPN, or follow [this tutorial](https://stackoverflow.com/questions/45692255/how-make-openvpn-work-with-docker).

Now start the necessary subgraph Docker containers.

```bash
docker-compose up
```

You should see ganache logs start coming in

```
Listening on 0.0.0.0:8545
web3_clientVersion
net_version
eth_getBlockByNumber
eth_getBlockByNumber
```

If there is some connection issue between graph-node and ganache, it may be caused by docker network issues.

I had to run the following command to get the correct host IP, instead of the one that `setup.sh` provided.

```bash
ip a | grep docker | grep inet
> inet 172.17.0.1/16 brd 172.17.255.255 scope global docker0
```

Ty changing the line in the docker-compose using the output above

```
ethereum: 'mainnet:http://172.17.0.1:8545'
```

## Deploy the contracts to Ganache

> Note: If you're returning from an earlier work session, skip down to [Testing](#testing).

Navigate to the `examples/erc20/packages/contracts` directory and run deploy command.

```bash
yarn test-deploy

> .......
> TestToken deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
> ========================= TEST ERC20 TOKEN ==========================
> export ERC20_TOKEN_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Copy the `export` command from your output and run it. NOTE: you must load this environment variable in the same terminal which you run `yarn test-*`.

Copy the address for `TestToken`, which will be used later.

## Deploy the Subgraph

Enter the address for `TestToken` from the previous step in `config/local.json`.

We are now ready to deploy our subgraph.

Navigate to the `examples/erc20/packages/subgraphs` directory

```bash
# Generate "subgraph.yaml" using the template
yarn prepare-local

# Generate the subgraph schema
yarn codegen

# Check the subgraph will compile
yarn build

# Create the namespace for the subgraph (only run once)
yarn create-local

# Deploy the subgraph
yarn deploy-local

> Deployed to http://localhost:8000/subgraphs/name/test/erc20-example
```

> If you see "NetworkNotSupported" error, make sure the network name in your docker-compose matches the one in subgraph.yaml

Navigate to the url in the console output, and let's try a test query so we know the deployment worked. It should return an empty `users` array

```
{
  users{
    id
  }
}
```

:tada: Congrats! In the next section we will setup automatic subgraph re-deployments and run tests.

## Testing

Now that you have everything set up, you can start making changes to the subgraph. To automatically re-reploy the subgraph, we will use the `--watch` flag.

You will use this flow anytime you want to restart, or come back to the subgraph.

1. In the repo `graph-node/docker`, stop your docker instance, and restart it:

```bash
# Blow away the database
sudo rm -rf data
docker-compose up
```

2. Deploy the contracts to ganache (if needed)

Remember to use the same mnemonic, or update the contract address in `subgraph.yaml`

3. Start subgraph auto re-deploy

```bash
yarn create-local
yarn deploy-local --watch
```

4. Generate activity

Run the test to generate some activity on your local ganache contracts

```bash
yarn test-mints
```

## Troubleshooting

### Docker

Sometimes docker container won't stop

`Cannot kill container d28... signaling init process caused "permission denied"`

Try running

```
sudo killall containerd-shim
```

### Subgraph

Another way to perform a sanity check is using a http query with the following:

| Property     | value                                                     |
| ------------ | --------------------------------------------------------- |
| URL          | `http://localhost:8000/subgraphs/name/test/erc20-example` |
| Request type | POST                                                      |
| body         | GraphQL                                                   |

```graphql
query {
    users(first: 2) {
        id
        balance
    }
}
```

You should get a response like this

```js
{
  "data": {
    "users": [
      {
        "balance": "0",
        "id": "0x0000000000000000000000000000000000000000"
      },
      {
        "balance": "3000000000000000000000",
        "id": "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc"
      }
    ]
  }
}
```

# Production

## Hosted Service

Log in to the explorer at https://thegraph.com/explorer/. Then go to your dashboard. IMPORTANT: select the Superfluid-Finance account- don't use your your personal account. Copy the auth token to use in this command:

```
graph auth https://api.thegraph.com/deploy/ <ACCESS_TOKEN>
```

If the subgraph has not been created yet, you must create it first using the dashboard.

# Contributing

Contributions, suggestions, and issues are welcome. At the moment, there are no strict guidelines to follow.
