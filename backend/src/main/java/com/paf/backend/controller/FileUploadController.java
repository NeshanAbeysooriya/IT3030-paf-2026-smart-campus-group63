package com.paf.backend.controller;


import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

@RestController
@RequestMapping("/api/files") //file upload handle
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads/"; //define upload folder path

    @PostMapping("/upload-image") // file upload endpoint
    public String uploadImage(@RequestParam("file") MultipartFile file) throws IOException { // frontend ekem ena file data multipartfile object ekt conver karanva, file save karanva, file URL return karanva

        if (file.isEmpty()) { // check file is empty, if empty return message file is empty
            return "File is empty";
        }

        // create folder if not exists
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // unique file name
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();// duplicate files name avoid karanva

        Path path = Paths.get(UPLOAD_DIR + fileName); // file ek save vena location ek denva file name ekath ekk

        Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING); // actual file disk ekt save karanva

        // return URL- frontend access url
        return "http://localhost:8081/uploads/" + fileName;
    }
}
