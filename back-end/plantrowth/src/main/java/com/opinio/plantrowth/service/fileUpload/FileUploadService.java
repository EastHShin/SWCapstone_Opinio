package com.opinio.plantrowth.service.fileUpload;

import com.amazonaws.services.s3.model.ObjectMetadata;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class FileUploadService {
    private final UploadService s3Service;

    public String uploadImage(MultipartFile file, String path) {
        String fileName = path + "/" + createFileName(file.getOriginalFilename());
        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentLength(file.getSize());
        objectMetadata.setContentType(file.getContentType());
        try(InputStream inputStream = file.getInputStream()){
            s3Service.uploadFile(inputStream, objectMetadata, fileName);
        }catch (IOException e){
            throw new IllegalArgumentException(String.format("파일 변환 중 에러가 발생했습니다 (%s)", file.getOriginalFilename()));
        }
        return s3Service.getFileUrl(fileName);    //파일Url return
//        return fileName;      //fileName return
    }

    private String createFileName(String originalFilename) {
        return UUID.randomUUID().toString().concat(getFileExtension(originalFilename));
    }

    private String getFileExtension(String fileName) {
        try{
            return fileName.substring(fileName.lastIndexOf("."));
        }catch (StringIndexOutOfBoundsException e){
            throw new IllegalArgumentException(String.format("잘못된 형식의 파일 (%s) 입니다", fileName));
        }
    }

}
