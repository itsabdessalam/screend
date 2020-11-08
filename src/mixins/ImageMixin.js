import config from "@/config";
import ScreendPortraitImg from "@/assets/images/screend-placeholder.jpg";

export default {
  methods: {
    getImageSource(movieImgPath, type) {
      let size = config.IMAGES_SIZES[type] || config.IMAGES_SIZES["default"];

      if (movieImgPath) {
        return `${config.BASE_IMAGE_URL}/${size}${movieImgPath}`;
      }
      // Set a default poster image if the movie does not have its own
      return ScreendPortraitImg;
    }
  }
};
