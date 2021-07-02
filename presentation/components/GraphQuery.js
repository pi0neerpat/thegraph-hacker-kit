import React from "react";
import axios from "axios";
import { JsonToTable } from "react-json-to-table";

const GRAPH_QUERY_URL =
    "https://api.thegraph.com/subgraphs/name/dan13ram/fdai-token";
const USER_ADDRESS = "0x2bf02814ea0b2b155ed47b7cede18caa752940e6";
const query = `
{
  user(id: "${USER_ADDRESS}"){
    address: id
    balance
    token {
      address: id
      symbol
    }
  }
}
`;
const GraphQuery = () => {
    const [data, setData] = React.useState({});

    const loadData = async () => {
        const result = await axios.post(GRAPH_QUERY_URL, { query });
        setData(result.data.data.user);
    };

    React.useEffect(() => {
        loadData();
    }, []);
    return (
        <>
            User address: {USER_ADDRESS}
            <br />
            <JsonToTable json={data} />
        </>
    );
};

export default GraphQuery;
