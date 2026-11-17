import { useEffect, type ReactNode } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

/** Gently floats its children; slower and subtler when the pet is sleepy. */
export function Bob({
  children,
  calm = false,
}: {
  children: ReactNode;
  calm?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const y = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) {
      y.value = 0;
      return;
    }
    y.value = withRepeat(
      withTiming(calm ? -4 : -10, {
        duration: calm ? 2200 : 900,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true,
    );
  }, [calm, reduceMotion, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}
