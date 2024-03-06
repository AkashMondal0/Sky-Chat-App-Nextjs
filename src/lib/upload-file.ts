import axios from "axios";
import { localhost } from "../../keys";

const skyUploadImage = async (file: string[], userId: string) => {
  try {
    const data = new FormData();
    for (let i = 0; i < file.length; i++) {
      data.append('file', file[i] as any);
    }
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const res = await axios.post(`${localhost}/file/multiple/${userId}`, data, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}
const skyUploadVideo = async (file: string[], userId: string) => {
  try {
    const data = new FormData();
    for (let i = 0; i < file.length; i++) {
      data.append('file', file[i] as any);
    }
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const res = await axios.post(`${localhost}/file/multiple/${userId}`, data, config);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export {
  skyUploadImage,
  skyUploadVideo
}