# Admin Panel with Video Approval System

This is an admin panel system that includes a video approval feature for Unreal Engine integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on http://localhost:3000

## API Endpoints

### POST /api/videos
Send a video for approval from Unreal Engine:
```json
{
    "videoUrl": "https://www.youtube.com/embed/VIDEO_ID",
    "userId": "user123",
    "timestamp": "2024-03-21T12:00:00Z" // Optional
}
```

### GET /api/videos
Get all pending videos for approval

### PUT /api/videos/:id
Update video status:
```json
{
    "status": "approved" // or "blocked" or "needs_changes"
}
```

## Unreal Engine Integration

To send video links from Unreal Engine to the admin panel, use the following Blueprint or C++ code:

```cpp
// C++ Example
void SendVideoForApproval(const FString& VideoUrl, const FString& UserId)
{
    FHttpModule& HttpModule = FHttpModule::Get();
    TSharedRef<IHttpRequest, ESPMode::ThreadSafe> Request = HttpModule.CreateRequest();
    
    Request->SetURL("http://localhost:3000/api/videos");
    Request->SetVerb("POST");
    Request->SetHeader("Content-Type", "application/json");
    
    FString JsonString = FString::Printf(
        TEXT("{\"videoUrl\":\"%s\",\"userId\":\"%s\"}"),
        *VideoUrl,
        *UserId
    );
    
    Request->SetContentAsString(JsonString);
    Request->ProcessRequest();
}
```

## Features

- Real-time video approval system
- Admin panel interface for reviewing videos
- Status tracking for each video
- Integration with Unreal Engine
- RESTful API endpoints

## Security Note

This is a basic implementation. For production use, please add:
- Authentication
- HTTPS
- Database storage
- Input validation
- Rate limiting 