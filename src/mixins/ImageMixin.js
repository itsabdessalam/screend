import config from "@/config";
import ScreendPortraitImg from "@/assets/images/screend-portrait.png";

export default {
  methods: {
    getImageSource(movieImgPath) {
      if (movieImgPath) {
        return `${config.BASE_IMAGE_URL}/${movieImgPath}`;
      }
      // Set a default poster image if the movie does not have its own
      return ScreendPortraitImg;
    }
  }
};
