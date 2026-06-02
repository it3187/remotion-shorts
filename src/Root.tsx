import "./index.css";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { RadioOP } from "./RadioOP";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={150} // 30fps * 5秒 = 150フレーム
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="RadioOP"
        component={RadioOP}
        durationInFrames={480} // 30fps * 16秒 = 480フレーム
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="RadioOP-GreenScreen"
        component={() => (
          <div style={{ backgroundColor: "#00FF00", width: "100%", height: "100%" }}>
            <RadioOP />
          </div>
        )}
        durationInFrames={480} // 30fps * 16秒 = 480フレーム
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
