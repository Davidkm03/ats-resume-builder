# CV Management API Documentation

This document describes the CV management API endpoints for the ATS Resume Builder application.

## Authentication

All endpoints (except public shared CV viewing) require authentication via NextAuth session.

## Base URL

```
/api/cvs
```

## Endpoints

### List User CVs

**GET** `/api/cvs`

Returns a paginated list of the authenticated user's CVs.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 20 | Number of CVs per page (max 100) |
| `search` | string | - | Search term for CV name or description |
| `template` | string | - | Filter by template type |
| `sortBy` | string | updatedAt | Sort field (name, createdAt, updatedAt) |
| `sortOrder` | string | desc | Sort order (asc, desc) |

#### Response

```json
{
  "cvs": [
    {
      "id": "cv-123",
      "name": "Software Engineer Resume",
      "description": "My professional resume",
      "template": "modern",
      "isPublic": false,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "atsScore": 85
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 20
}
```

### Create New CV

**POST** `/api/cvs`

Creates a new CV for the authenticated user.

#### Request Body

```json
{
  "name": "My New CV",
  "description": "Optional description",
  "template": "modern",
  "data": {
    // Optional: CV data structure
    // If not provided, default structure is created
  }
}
```

#### Response

```json
{
  "cv": {
    "id": "cv-456",
    "userId": "user-123",
    "name": "My New CV",
    "description": "Optional description",
    "template": "modern",
    "data": { /* CV data structure */ },
    "isPublic": false,
    "shareToken": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Get Specific CV

**GET** `/api/cvs/{id}`

Returns a specific CV owned by the authenticated user.

#### Response

```json
{
  "cv": {
    "id": "cv-123",
    "userId": "user-123",
    "name": "Software Engineer Resume",
    "description": "My professional resume",
    "template": "modern",
    "data": { /* Full CV data structure */ },
    "isPublic": false,
    "shareToken": null,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Update CV

**PUT** `/api/cvs/{id}`

Updates a specific CV owned by the authenticated user.

#### Request Body

```json
{
  "name": "Updated CV Name",
  "description": "Updated description",
  "template": "professional",
  "data": {
    // Partial CV data to merge with existing data
    "summary": "Updated professional summary",
    "skills": ["JavaScript", "React", "Node.js"]
  },
  "isPublic": true
}
```

#### Response

```json
{
  "cv": {
    // Updated CV object
  }
}
```

### Delete CV

**DELETE** `/api/cvs/{id}`

Deletes a specific CV owned by the authenticated user.

#### Response

```json
{
  "message": "CV deleted successfully",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Duplicate CV

**POST** `/api/cvs/{id}/duplicate`

Creates a copy of an existing CV.

#### Request Body

```json
{
  "name": "Copy of My CV",
  "description": "Duplicated resume"
}
```

#### Response

```json
{
  "cv": {
    // New CV object with duplicated data
  },
  "message": "CV duplicated successfully"
}
```

### Generate Share Link

**POST** `/api/cvs/{id}/share`

Generates a shareable public link for a CV.

#### Response

```json
{
  "shareToken": "abc123def456",
  "shareUrl": "https://example.com/cv/shared/abc123def456",
  "cv": {
    "id": "cv-123",
    "name": "Software Engineer Resume",
    "isPublic": true,
    "shareToken": "abc123def456"
  },
  "message": "Share link generated successfully"
}
```

### Remove Share Link

**DELETE** `/api/cvs/{id}/share`

Removes the share link and makes the CV private.

#### Response

```json
{
  "cv": {
    "id": "cv-123",
    "name": "Software Engineer Resume",
    "isPublic": false,
    "shareToken": null
  },
  "message": "Share link removed successfully"
}
```

### View Shared CV (Public)

**GET** `/api/cvs/shared/{token}`

Returns a publicly shared CV by its share token. No authentication required.

#### Response

```json
{
  "cv": {
    "id": "cv-123",
    "name": "Software Engineer Resume",
    "template": "modern",
    "data": { /* Sanitized CV data */ },
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z",
    "owner": "John Doe"
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details (for validation errors)",
    "timestamp": "2023-01-01T00:00:00.000Z"
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Access denied
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid request data
- `INTERNAL_ERROR` (500): Server error

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- Authenticated endpoints: 100 requests per minute per user
- Public endpoints: 20 requests per minute per IP

## CV Data Structure

The CV data follows a comprehensive schema including:

- **Contact Information**: Name, email, phone, location, social links
- **Professional Summary**: Brief overview of experience
- **Work Experience**: Job history with descriptions and achievements
- **Education**: Academic background
- **Skills**: Technical and soft skills
- **Projects**: Portfolio projects with descriptions
- **Certifications**: Professional certifications
- **Languages**: Language proficiency
- **Awards**: Professional recognition
- **Publications**: Published works
- **Volunteer Work**: Community involvement
- **Custom Sections**: User-defined sections

For detailed schema information, see the TypeScript interfaces in `/src/types/cv.ts`.

## Examples

### Creating a CV with Basic Information

```bash
curl -X POST /api/cvs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Software Engineer Resume",
    "template": "modern",
    "data": {
      "contact": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "location": "San Francisco, CA"
      },
      "summary": "Experienced software engineer with 5+ years in web development",
      "skills": ["JavaScript", "React", "Node.js", "Python"]
    }
  }'
```

### Updating CV Skills

```bash
curl -X PUT /api/cvs/cv-123 \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "skills": ["JavaScript", "React", "Node.js", "Python", "TypeScript"]
    }
  }'
```

### Sharing a CV

```bash
curl -X POST /api/cvs/cv-123/share
```

This will return a shareable URL that can be accessed without authentication.