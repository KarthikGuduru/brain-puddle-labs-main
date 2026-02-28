import axios from 'axios';

async function check() {
    try {
        const res = await axios.get('https://api.bfl.ml/openapi.json'); // or api.bfl.ai
        const paths = Object.keys(res.data.paths);
        console.log("Available endpoints:");
        paths.forEach(p => console.log(p));
    } catch (e) {
        console.error("error", e.message);
    }
}
check();
