
export async function generateImage(prompt: string): Promise<string> {
  try {
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/fal-ai/stable-diffusion-v35-large-turbo",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          sync_mode: true, // ensures the API returns a completed image
          parameters: {
            num_inference_steps: 25, // optional: adjust quality/speed
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Image generation failed: ${errorData?.error || response.statusText}`
      );
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob); // creates a frontend-friendly URL for <img>
  } catch (error: any) {
    console.error("Error generating image:", error);
    throw error;
  }
}
