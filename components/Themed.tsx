import {
    Text,
    View,
    ViewProps,
    TextProps,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ScrollViewProps,
    GestureResponderEvent,
    TextInput,
    TextInputProps,
    ViewStyle,
    InputAccessoryView,
    Keyboard,
    EmitterSubscription,
  } from 'react-native';
  import Animated, {
    useSharedValue,
    withTiming,
    useAnimatedStyle,
  } from 'react-native-reanimated';
  
  import {
    TapGestureHandler,
    State,
    GestureHandlerRootView,
  } from 'react-native-gesture-handler';
  
  import { Check, AlertCircle } from 'lucide-react-native';
  import React, { useEffect, useRef, useState } from 'react';
  import { useTheme } from '@/context/ThemeContext';
  import { Ionicons } from '@expo/vector-icons';
  
  // Types
  type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  type ButtonVariant = 'outline' | 'link' | 'primary' | 'secondary' | 'ghost';
  type FlexAlignType = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  
  // RamaText Component
  interface RamaTextProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';
    text?: string;
  }
  
  export const RamaText: React.FC<RamaTextProps> = ({
    children,
    variant = 'p1',
    text,
    style,
    ...rest
  }) => {
    const { colours } = useTheme();
    const styles = textStyles(colours);
  
    return (
      <Text style={[styles[variant], style]} {...rest}>
        {children || text}
      </Text>
    );
  };
  
  // RamaView Components
  interface RamaViewProps extends ViewProps {}
  
  export const RamaBackView: React.FC<RamaViewProps> = ({ children, style, ...rest }) => {
    const { colours, colourTheme } = useTheme();
    const styles = StyleSheet.create({
      view: {
        backgroundColor: colourTheme === "dark" ? colours.background.strong : colours.background.default,
        flex: 1,
      },
    });
  
    return (
      <View style={[styles.view, style]} {...rest}>
        {children}
      </View>
    );
  };
  
  export const RamaScrollView: React.FC<ScrollViewProps> = ({ children, style, ...rest }) => {
    const { colours } = useTheme();
    const styles = StyleSheet.create({
      view: {
        backgroundColor: colours.background.strong,
        flexGrow: 1,
      },
    });
  
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={[styles.view, style]} {...rest}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };
  
  // RamaCard Component
  interface RamaCardProps extends ViewProps {
    elevation?: number;
  }
  
  export const RamaCard: React.FC<RamaCardProps> = ({ elevation = 2, style, children, ...rest }) => {
    const { colours, colourTheme } = useTheme();
    const styles = StyleSheet.create({
      card: {
        borderRadius: 8,
        backgroundColor: colourTheme === "dark" ? colours.background.default : colours.background.strong,
        elevation: elevation,
        shadowColor: colours.text.soft,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: elevation * 0.05,
        shadowRadius: 4,
      },
    });
  
    return (
      <View style={[styles.card, style]} {...rest}>
        {children}
      </View>
    );
  };
  
  {/** TO DO Switch them to expo-icons not just luicde react native icons. as i now need to be usong the variious icons from expo-icons **/}
  // RamaButton Component
  interface RamaButtonProps {
    size?: ButtonSize;
    variant?: ButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    leftIcon?: React.ElementType<any>;
    rightIcon?: React.ElementType<any>;
    onPress?: () => void;
    onLongPress?: () => void;
    children: React.ReactNode;
  }
  
  export const RamaButton: React.FC<RamaButtonProps> = ({
    size = 'md',
    variant = 'primary',
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    onPress,
    onLongPress,
    children,
  }) => {
    const { colours } = useTheme();
    const pressScale = useSharedValue(1);
  
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withTiming(pressScale.value, { duration: 100 }) }],
    }));
  
    const styles = buttonStyles(colours, size, variant, fullWidth);
  
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={() => { pressScale.value = 0.95; }}
        onPressOut={() => { pressScale.value = 1; }}
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={loading || disabled}
      >
        <Animated.View style={[styles.button, animatedStyle]}>
          {loading ? (
            <ActivityIndicator color={"#fff"} size={"small"} />
          ) : (
            <View style={styles.content}>
              {LeftIcon && <LeftIcon style={styles.icon} size={styles.content.fontSize} />}
              <RamaText style={styles.text}>{children}</RamaText>
              {RightIcon && <RightIcon style={styles.icon} size={styles.content.fontSize} />}
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  // RamaIconButton Component
  interface RamaIconButtonProps {
    icon: React.ElementType<any>;
    size?: ButtonSize;
    variant?: ButtonVariant;
    disabled?: boolean;
    onPress?: () => void;
    onLongPress?: () => void;
  }
  
  export const RamaIconButton: React.FC<RamaIconButtonProps> = ({
    icon: IconComponent,
    size = 'md',
    variant = 'primary',
    disabled = false,
    onPress,
    onLongPress,
  }) => {
    const { colours } = useTheme();
    const pressScale = useSharedValue(1);
  
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withTiming(pressScale.value, { duration: 100 }) }],
    }));
  
    const styles = iconButtonStyles(colours, size, variant);
  
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPressIn={() => { pressScale.value = 0.95; }}
        onPressOut={() => { pressScale.value = 1; }}
        onPress={onPress}
        onLongPress={onLongPress}
        disabled={disabled}
      >
        <Animated.View style={[styles.button, animatedStyle]}>
          <IconComponent color={styles.icon.color} size={styles.icon.fontSize} />
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  // Stack Components
  interface StackProps extends ViewProps {
    spacing?: number;
    align?: FlexAlignType;
    justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  }
  
  export const RamaVStack: React.FC<StackProps> = ({
    spacing = 1,
    align = 'stretch',
    justify = 'flex-start',
    style,
    children,
    ...rest
  }) => {
    const styles = stackStyles('column', spacing, align, justify);
  
    return (
      <View style={[styles.container, style]} {...rest}>
        {React.Children.map(children, (child, index) => (
          <View style={index > 0 ? { marginTop: spacing } : {}}>{child}</View>
        ))}
      </View>
    );
  };
  
  export const RamaHStack: React.FC<StackProps> = ({
    spacing = 8,
    align = 'center',
    justify = 'flex-start',
    style,
    children,
    ...rest
  }) => {
    const styles = stackStyles('row', spacing, align, justify);
  
    return (
      <View style={[styles.container, style]} {...rest}>
        {React.Children.map(children, (child, index) => (
          <View style={index > 0 ? { marginLeft: spacing } : {}}>{child}</View>
        ))}
      </View>
    );
  };
  
  // Styles
  const textStyles = (colours: any) => StyleSheet.create({
    h1: { fontSize: 20, color: colours.text.strong, fontWeight: 'bold' },
    h2: { fontSize: 18, color: colours.text.strong, fontWeight: 'bold' },
    h3: { fontSize: 16, color: colours.text.strong, fontWeight: 'bold' },
    h4: { fontSize: 15, color: colours.text.strong, fontWeight: 'normal' },
    h5: { fontSize: 14, color: colours.text.strong, fontWeight: 'normal' },
    h6: { fontSize: 13, color: colours.text.strong, fontWeight: 'normal' },
    p1: { fontSize: 15, color: colours.text.default, fontWeight: 'normal' },
    p2: { fontSize: 14, color: colours.text.default, fontWeight: 'normal' },
    p3: { fontSize: 13, color: colours.text.default, fontWeight: 'normal' },
    p4: { fontSize: 12, color: colours.text.default, fontWeight: 'normal' },
    p5: { fontSize: 11, color: colours.text.soft, fontWeight: 'normal' },
    p6: { fontSize: 10, color: colours.text.soft, fontWeight: 'normal' },
  });
  
  const buttonStyles = (colours: any, size: ButtonSize, variant: ButtonVariant, fullWidth: boolean) => {
    const sizeStyles = {
      xs: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 12 },
      sm: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 14 },
      md: { paddingVertical: 8, paddingHorizontal: 14, fontSize: 16 },
      lg: { paddingVertical: 10, paddingHorizontal: 20, fontSize: 18 },
      xl: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 20 },
    };
  
    const variantStyles = {
      outline: {
        borderColor: colours.primary,
        borderWidth: 1,
        backgroundColor: 'transparent',
        color: colours.primary,
      },
      link: {
        backgroundColor: 'transparent',
        color: colours.primary,
      },
      primary: {
        backgroundColor: colours.primary,
        color: '#fff',
      },
      secondary: {
        backgroundColor: colours.secondary,
        color: colours.text.onSecondary,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colours.text.default,
      },
    };
  
    return StyleSheet.create({
      button: {
        ...sizeStyles[size],
        ...variantStyles[variant],
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: fullWidth ? '100%' : 'auto',
      },
      content: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: sizeStyles[size].fontSize,
      },
      text: {
        color: variantStyles[variant].color,
        fontSize: sizeStyles[size].fontSize,
        fontWeight: 'bold',
      },
      icon: {
        marginHorizontal: 4,
        color: variantStyles[variant].color,
      },
    });
  };
  
  const iconButtonStyles = (colours: any, size: ButtonSize, variant: ButtonVariant) => {
    const sizeStyles = {
      xs: { size: 24, fontSize: 12 },
      sm: { size: 32, fontSize: 14 },
      md: { size: 40, fontSize: 16 },
      lg: { size: 48, fontSize: 18 },
      xl: { size: 56, fontSize: 20 },
    };
  
    const variantStyles = {
      outline: {
        borderColor: colours.primary,
        borderWidth: 1,
        backgroundColor: 'transparent',
        color: colours.primary,
      },
      link: {
        backgroundColor: 'transparent',
        color: colours.primary,
      },
      primary: {
        backgroundColor: colours.primary,
        color: '#000',
      },
      secondary: {
        backgroundColor: colours.secondary,
        color: colours.text.onSecondary,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colours.text.default,
      },
    };
  
    return StyleSheet.create({
      button: {
        width: sizeStyles[size].size,
        height: sizeStyles[size].size,
        borderRadius: sizeStyles[size].size / 2,
        ...variantStyles[variant],
        alignItems: 'center',
        justifyContent: 'center',
      },
      icon: {
        color: variantStyles[variant].color,
        fontSize: sizeStyles[size].fontSize * 1.5,
      },
    });
  };
  
  const stackStyles = (direction: 'row' | 'column', spacing: number, align: FlexAlignType, justify: string) =>
    StyleSheet.create({
      container: {
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
      },
    });
  
  
  interface RamaInputProps extends TextInputProps {
    label?: string;
    error?: string;
    success?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
    containerStyle?: ViewStyle;
    showPasswordToggle?: boolean;
    showClearButton?: boolean;
    showCharacterCount?: boolean;
    maxLength?: number;
    onClear?: () => void;
    inputAccessoryViewID?: string;
  }
  
  export const RamaInput: React.FC<RamaInputProps> = ({
    label,
    error,
    success,
    leftIcon,
    rightIcon,
    onRightIconPress,
    containerStyle,
    showPasswordToggle = false,
    showClearButton = false,
    showCharacterCount = false,
    maxLength,
    onClear,
    inputAccessoryViewID,
    style,
    ...rest
  }) => {
    const { colours } = useTheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputRef = useRef<TextInput>(null);
  
    const keyboardDidHideListener = useRef<EmitterSubscription | null>(null);
  
    useEffect(() => {
      keyboardDidHideListener.current = Keyboard.addListener(
        'keyboardDidHide',
        handleKeyboardDidHide
      );
  
      return () => {
        keyboardDidHideListener.current?.remove();
      };
    }, []);
  
    const handleKeyboardDidHide = () => {
      if (inputRef.current) {
        inputRef.current.blur();
      }
      setIsFocused(false);
    };
  
    const togglePasswordVisibility = () => {
      setIsPasswordVisible((prev) => !prev);
    };
  
    const handleClear = () => {
      if (inputRef.current) {
        inputRef.current.clear();
      }
      if (onClear) {
        onClear();
      }
    };
  
    const labelStyle = {
      position: 'absolute',
      left: leftIcon ? 36 : 12,
      top: 12,
      fontSize: 14,
      color: colours.text.default
    };
  
    const handleFocus = () => {
      setIsFocused(true);
    };
  
    const handleBlur = () => {
      setIsFocused(false);
    };
  
    const styles = getStyles(colours, isFocused, !!error, success);
  
    const renderRightIcon = () => {
      if (showPasswordToggle) {
        return (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            {isPasswordVisible ? (
              <Ionicons name={"eye-off-outline"} color={colours.text.soft} size={20} />
            ) : (
              <Ionicons name={"eye-outline"} color={colours.text.soft} size={20} />
            )}
          </TouchableOpacity>
        );
      }
  
      if (showClearButton && rest.value) {
        return (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name={"close"} color={colours.text.soft} size={20} />
          </TouchableOpacity>
        );
      }
  
      if (error) {
        return <Ionicons name={"alert-circle-outline"} color={"red"} size={22} />;
      }
  
      if (success) {
        return <Ionicons name={"checkmark-outline"} color={"green"} size={22} />;
      }
  
      return rightIcon;
    };
  
    const renderInputAccessory = () => {
      if (Platform.OS === 'ios' && inputAccessoryViewID) {
        return (
          <InputAccessoryView nativeID={inputAccessoryViewID}>
            <View style={styles.inputAccessory}>
              <TouchableOpacity onPress={() => Keyboard.dismiss()}>
                <RamaText style={styles.doneButton}>Done</RamaText>
              </TouchableOpacity>
            </View>
          </InputAccessoryView>
        );
      }
      return null;
    };
  
    return (
        <>
          <View style={[styles.container, containerStyle]}>
          {label && (
            <Text style={[styles.label, labelStyle]}>{label}</Text>
          )}
          <View style={styles.inputContainer}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <TapGestureHandler
              onHandlerStateChange={({ nativeEvent }) => {
                if (nativeEvent.state === State.ACTIVE) {
                  inputRef.current?.focus();
                }
              }}
            >
              <TextInput
                ref={inputRef}
                style={[
                  styles.input,
                  leftIcon && { paddingLeft: 40 },
                  rightIcon && { paddingRight: 40 },
                  style,
                ]}
                placeholderTextColor={colours.text.soft}
                onFocus={handleFocus}
                onBlur={handleBlur}
                secureTextEntry={showPasswordToggle && !isPasswordVisible}
                maxLength={maxLength}
                inputAccessoryViewID={inputAccessoryViewID}
                {...rest}
              />
            </TapGestureHandler>
            {renderRightIcon() && (
              <TouchableOpacity
                style={styles.rightIcon}
                onPress={onRightIconPress || togglePasswordVisibility}
              >
                {renderRightIcon()}
              </TouchableOpacity>
            )}
          </View>
          {error && <RamaText style={styles.errorText}>{error}</RamaText>}
          {showCharacterCount && maxLength && (
            <RamaText style={styles.characterCount}>
              {(rest.value?.length || 0)} / {maxLength}
            </RamaText>
          )}
        </View>
        {renderInputAccessory()}
        </>
    );
  };
  
const getStyles = (colours: any, isFocused: boolean, isError: boolean, isSuccess: boolean) =>
StyleSheet.create({
    container: {
    marginBottom: 16,
    },
    inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: isError
        ? colours.danger
        : isSuccess
        ? colours.success
        : isFocused
        ? colours.primary
        : colours.background.soft,
    backgroundColor: colours.background.soft,
    },
    input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    color: colours.text.default,
    fontSize: 16,
    },
    label: {
    position: 'absolute',
    left: 12,
    color: colours.text.soft,
    backgroundColor: colours.background.soft,
    paddingHorizontal: 4,
    },
    leftIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    },
    rightIcon: {
    position: 'absolute',
    right: 12,
    zIndex: 1,
    },
    errorText: {
    color: colours.danger,
    fontSize: 12,
    marginTop: 4,
    },
    characterCount: {
    color: colours.text.soft,
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
    },
    inputAccessory: {
    backgroundColor: colours.background.strong,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    },
    doneButton: {
    color: colours.primary,
    fontSize: 16,
    fontWeight: 'bold',
    },
});
  
  
    