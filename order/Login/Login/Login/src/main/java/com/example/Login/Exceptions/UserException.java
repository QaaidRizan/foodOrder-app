package com.example.Login.Exceptions;

public class UserException extends RuntimeException{
    private static final long serialVersionUID = 1348771109171435607L;
    public UserException(String message) {
        super(message);
    }
}
