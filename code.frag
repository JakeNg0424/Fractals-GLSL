#define INPUTS sTD2DInputs
#define MAX_ITER 1000
#define EPSILON 0.0005

uniform vec2 zoom_pos;
uniform float zoom_level;

// MandelbrotSet returns:
//   0 if the complex polynomial converges
//   absolute and normalized rate of divergence otherwise
vec2 MandelbrotSet(vec2 z0)
{
    vec2 z = z0; // Initial position in the complex plane
    for (int iter = 0; iter < MAX_ITER; iter++)
    {
        // Everything outside of circle with radius=2 diverges
        if (length(z) > 2.0)
            return vec2(float(iter), float(iter) / float(MAX_ITER));
        // One iteration of complex polynomial: z = z^2 + c
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + z0;
    }
    return vec2(0.0);
}

out vec4 fragColor0;
out vec4 fragColor1;
void main()
{
    // Determine complex-plane coordinate of the current pixel
    vec2 pos_xy = zoom_pos + exp(-zoom_level) * (vUV.xy - vec2(0.5));

    // Evaluate the Mandelbrot set
    vec2 mandel = MandelbrotSet(pos_xy);

    // Map the result to a color palette
    vec3 color = (mandel.x == 0.0) ? vec3(0.0) : texture(INPUTS[0], vec2(1.0 - exp(-2.0 * mandel.y), 0.5)).rgb;

    // Add crosshair and output fragment
    if (vUV.x > 0.5 - EPSILON && vUV.x < 0.5 + EPSILON || vUV.y > 0.5 - EPSILON && vUV.y < 0.5 + EPSILON)
        color += vec3(0.2);
    fragColor0 = TDOutputSwizzle(vec4(color, 1.0));
    fragColor1 = TDOutputSwizzle(vec4(mandel.yyy, 1.0));
}