import { useEffect, useState } from "react";
import api from "../../../utils/api";

type MyESPsProps = {
    navigation: any; // Tipo da prop "navigation" deve ser ajustado conforme necessário.
};

const ProfileSettings: React.FC<MyESPsProps> = ({ navigation }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            getData();
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    async function getData() {
        api.post("/app/refreshSession").then((res) => {
            setData(res.data?.user)
        }).catch((error) => {
        })
    }

    return (<>
    </>)
}

export default ProfileSettings