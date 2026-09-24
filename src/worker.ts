import {quantize} from './quantize';
self.onmessage=e=>{const {data,count,bg}=e.data;self.postMessage(quantize(data,count,bg))};
