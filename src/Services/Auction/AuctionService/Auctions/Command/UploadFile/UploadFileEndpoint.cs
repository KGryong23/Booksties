namespace AuctionService.Auctions.Command.UploadFile;

public class UploadFileEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/upload-file", async (HttpRequest request) =>
        {
            if (!request.HasFormContentType || request.Form.Files.Count == 0)
            {
                return Results.Ok(new Response<int>(
                    301,
                    "No file uploaded",
                    0
                ));
            }

            var file = request.Form.Files[0];

            var uploadPath = Path.Combine("Images");
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            var fileExtension = Path.GetExtension(file.FileName);
            var newFileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadPath, newFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Results.Ok(new Response<string>(
                    201,
                    "File uploaded succced",
                    newFileName
            ));
        });
    }
}



