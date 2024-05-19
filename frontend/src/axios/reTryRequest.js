import axios from "axios";

let AMOUNT_RETRY = 5;

async function retry(requet) {
  let retry = 0;

  while (retry <= 5) {
    try {
      const response = requet();

      let data;

      await response.then(response => {
        data =response.data;
      })
      
      if (data) {
        return response;
      } else {
        retry++;
      }
    } catch (error) {
      console.log(error);
      retry++;
    }
  }
}

export default function axiosResquest(inctance = axios) {
  return {
    get: (url, data) => retry(() => inctance.get(url, data)),
    post: (url, data, config) => retry(() => inctance.post(url, data, config)),
    put: (url, data, config) => retry(() => inctance.put(url, data, config)),
    delete: (url, config) => retry(() => inctance.delete(url, config)),
  };
}
