import { bodyParser, cors, Koa, logger, Router } from "./deps.ts";
import { Crawler } from "./router/Crawler/crawler.ts";
import { DatabaseRouter } from "./router/database/database.ts";
const app = new Koa();
const router = new Router();
router
    .use("/crawler", Crawler.routes())
    .use("/database", DatabaseRouter.routes())
    .get("/", (ctx) => {
        ctx.body = "这是魔导绪论的后端，请勿调用！！！！";
    });
app.use(logger())
    .use(
        cors({
            origin: "*",
        })
    )
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(8000, () => {
    console.log("服务启动了");
});
