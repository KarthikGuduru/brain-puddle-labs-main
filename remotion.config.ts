import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

export default {
    codec: "h264",
    entryPoint: "./remotion/index.ts",
};
