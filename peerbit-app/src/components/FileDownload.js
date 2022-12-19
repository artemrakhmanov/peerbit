import fileDownload from 'js-file-download'
import axios from 'axios'


const handleDownload = (url, filename) => {
    axios.get(url, {
        responseType: 'blob',
      })
      .then((res) => {
        fileDownload(url, filename)
      })


    
}

export default handleDownload 