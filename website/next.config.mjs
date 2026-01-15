import nextra from 'nextra'

const withNextra = nextra({
    // Nextra-specific options
})

export default withNextra({
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
})
