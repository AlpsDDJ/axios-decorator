import {Axios, Get} from "../index";
import {HttpRequest} from "../request";

@Axios('https://cn.bing.com/rp/mSXQPT7e1TlMt8h0fagSrjh90gY.br.js')
class TestAxios {
    @Get()
    httpGet?: HttpRequest
}

test('', async () => {
    const testAxios = new TestAxios()
    const resp = await testAxios.httpGet!()
    console.log(resp)
})