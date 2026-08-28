import { ImageResponse } from 'next/og'

const FONT_FAMILY = 'Playfair Display'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const size = searchParams.get('size') || '64'
  const width = parseInt(size, 10)
  const height = parseInt(size, 10)

  // 确保尺寸在合理范围内
  const safeWidth = Math.max(16, Math.min(1024, width))
  const safeHeight = Math.max(16, Math.min(1024, height))

  return new ImageResponse(
    (
      <div
        style={{
          width: safeWidth,
          height: safeHeight,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
        }}
      >
        <span
          style={{
            fontSize: safeWidth * 0.6,
            fontWeight: 'bold',
            fontFamily: FONT_FAMILY,
            color: '#FFFFFF',
          }}
        >
          U
        </span>
      </div>
    ),
    {
      width: safeWidth,
      height: safeHeight,
      headers: {
        'cache-control': 'public, max-age=31536000, immutable',
      },
    }
  )
}