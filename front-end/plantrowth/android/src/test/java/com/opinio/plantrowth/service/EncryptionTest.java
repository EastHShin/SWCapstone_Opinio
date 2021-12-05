package com.opinio.plantrowth.service;


import lombok.extern.slf4j.Slf4j;
import org.assertj.core.api.Assertions;
import org.jasypt.encryption.StringEncryptor;
import org.junit.FixMethodOrder;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
@Slf4j
class EncryptionTest {

    @Autowired
    private StringEncryptor jasyptStringEncryptor;

    @Test
    public void _0_testInit() throws Exception{
        //given

        //when

        //then
        Assertions.assertThat(jasyptStringEncryptor).isNotNull();
    }

    @Test
    public void _1_encrypt_decrypt() throws Exception{
        String orgText = "tlsehdgns78";

        String encText = jasyptStringEncryptor.encrypt(orgText);
        System.out.printf("##### encText : %s\n", encText);

        String decText = jasyptStringEncryptor.decrypt(encText);

        Assertions.assertThat(decText).isEqualTo(orgText);
    }
}
