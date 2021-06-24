import React from "react"
import axios from 'axios'
import { JsonToTable } from "react-json-to-table";

const NETWORK_NAME = 'goerli'
const GRAPH_API_BASE_URL = "https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-"
const USER_ADDRESS = "0x000deb0c92e6d3da7f77ed01b8473b3f7f4efc39"
const QUERY_URL = GRAPH_API_BASE_URL + NETWORK_NAME
const query = `
{
    account(id: "${USER_ADDRESS}") {
        flowsOwned {
            flowRate
            sum
            lastUpdate
            token { 
                id
                symbol
            }
        }
    }
  }
`
const GraphQuery = () => {
    const [data,setData] = React.useState({})

    const loadData = async () => {
        const result = await axios.post(QUERY_URL, { query })
        setData(result.data.data.account)
    }

    React.useEffect(()=>{
        loadData()
    })
    return (
        <>
            User address: {USER_ADDRESS}<br/>
            Network: {NETWORK_NAME}
            <JsonToTable json={data} />
        </>
    )
}

export default GraphQuery