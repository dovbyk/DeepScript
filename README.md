# Convert any text in your own handwriting

## ℹ️ Project Overview
This project is used to convert any digital text into a custom handwritten format. You can either choose the existing one or can even upload your own handwriting sample too.

## 🚀 Get Started
* Click 🔗[here](https://deepscript.vercel.app) to open the site.
* You will see two sections: Select Font and Upload Your Writing Sample
* Select the existing font and generate the output. You will be given a preview of it and then you can download it

     ### Upload your writing Sample
    * For Uploading your own handwriting sample, follow the `handwriting_sample.jpeg` format. Make sure the image is clean and the characters are visible. Try to avoid the Scanned Image
    * After you upload, each characters are segmented and properly renamed. The renaming of those images should be in the format a.png , b.png etc. which will be done by Gemini API
    * If some of the images are incorrectly labelled, then correct it.
    * Hit the Generate Font button and you will get your font file
    * Select it and generate your output

* Make sure to avoid latex code in the text

## Sample Output
![Output](frontend/public/output.jpg)


## Deployments
* Frontend : [Vercel](vercel.com)
* Backend : [Render](render.com)


## ⚠️ Disclaimer
* Since the backend is deployed using free instance on [Render](render.com), the first output generation may take few more seconds but after that it will come back to normal. 
* You can see some small boxes appearning in the above output image. This occurs if your input text contains symbols or special characters that were not initally programmed. Current version supports only basic punctuation symbols. So if you encounter those small boxes in your output, just remove that symbol. 


