<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6">
      <h2 class="text-2xl font-semibold mb-6 text-center text-gray-800">
        Payment Transcription
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- LEFT: Upload QR Image -->
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center"
        >
          <img
            v-if="preview"
            :src="preview"
            class="w-56 h-56 object-contain mb-4 rounded"
          />

          <p v-else class="text-gray-400 mb-4">Upload Payment Transition</p>

          <input
            type="file"
            accept="image/*"
            class="hidden"
            ref="fileInput"
            @change="handleImage"
          />

          <button
            @click="$refs.fileInput.click()"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Select Image
          </button>

          <!-- SUBMIT BUTTON -->
          <button
            @click="submitImage"
            :disabled="!image || loading"
            class="mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            {{ loading ? "Sending..." : "Submit" }}
          </button>
        </div>

        <!-- RIGHT: Info Text + Image -->
        <div class="flex flex-col justify-center space-y-4">
          <p class="text-lg font-semibold text-gray-800">
            Academic Document Verification payment 
          </p>

          <p class="text-gray-600">
           🌟Certification 1 = 1$
          </p>

          <p class="text-gray-600">
           🌟Transcription 1 = 1$
          </p>

          <img
            src="/qr.png"
            class="rounded-lg shadow-md"
            alt="Verification"
            width="200"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image: null,
      preview: null,
      loading: false,
      BOT_TOKEN: "8515689151:AAFsjsS91XposLwPPfuHLIRPVlwN0L0kMIE",
      CHAT_ID: "-5234855220",
    };
  },
  methods: {
    handleImage(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.image = file;
      this.preview = URL.createObjectURL(file);
    },

    async submitImage() {
      if (!this.image) return;

      this.loading = true;

      const formData = new FormData();
      formData.append("chat_id", this.CHAT_ID);
      formData.append("photo", this.image);
      const paymentDateTime = new Date().toLocaleString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      formData.append("caption", `💰 Payment Date & Time: ${paymentDateTime}`);

      try {
        await fetch(`https://api.telegram.org/bot${this.BOT_TOKEN}/sendPhoto`, {
          method: "POST",
          body: formData,
        });

        alert("Image uploaded successfully ✅");

        // Reset
        this.image = null;
        this.preview = null;
      } catch (err) {
        console.error(err);
        alert("Failed to send image ❌");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
