# Preserve React Native classes and methods
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}

# Preserve annotations
-keepattributes *Annotation*

# Prevent stripping of dynamically referenced code
-keep class com.facebook.** { *; }
-keep class androidx.** { *; }

# Avoid warnings
-dontwarn com.facebook.react.**
-dontwarn javax.annotation.**
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn android.**
