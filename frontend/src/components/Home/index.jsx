import "./styles.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`${API_URL}/api/photo/list`);
            const data = await res.json();
            setPhotos(data);
        };
        fetchData();
    }, []);

    const handleClickPhoto = (photo) => {
        navigate(`/photos/${photo._id}`);
    }

    return (
        <div className="image-grid">
            {photos.map((photo) => (
                <div className="image-box" key={photo._id} onClick={() => handleClickPhoto(photo)}>
                    <img src={`/images/${photo.file_name}`} className="image" alt="" />
                </div>
            ))}
        </div>
    )
}

export default Home;